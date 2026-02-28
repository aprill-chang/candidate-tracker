/**
 * Vercel serverless function: fetch Ashby report data.
 * Keeps ASHBY_API_KEY server-side. Requires Reports – Read permission.
 * Report ID = UUID from your report URL after "saved-v0/" (optional: set ASHBY_REPORT_ID in Vercel).
 */
const DEFAULT_REPORT_ID = 'c3ad3c95-3463-4710-a7f0-351d9a2004c2';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.ASHBY_API_KEY;
  // Debug: safe header so you can confirm if the server sees the env var (DevTools → Network → api/ashby-report → Headers)
  res.setHeader('X-Ashby-Key-Configured', apiKey && apiKey.length > 0 ? 'true' : 'false');
  if (!apiKey) {
    return res.status(500).json({
      error: 'Ashby API key not configured',
      hint: 'Set ASHBY_API_KEY in Vercel Environment Variables or in .env locally.',
    });
  }

  const reportId = process.env.ASHBY_REPORT_ID || DEFAULT_REPORT_ID;
  const authHeader =
    'Basic ' + Buffer.from(apiKey + ':', 'utf8').toString('base64');

  try {
    const response = await fetch('https://api.ashbyhq.com/report.synchronous', {
      method: 'POST',
      headers: {
        Accept: 'application/json; version=1',
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        reportId: reportId,
        includeHeadersInData: true,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const status = response.status;
      if (status === 429) {
        return res.status(429).json({
          error: 'Ashby rate limit exceeded',
          details: data,
        });
      }
      return res.status(status).json({
        error: 'Ashby API error',
        status,
        details: data,
      });
    }

    // Unwrap: Ashby returns { success, results: { requestId, status, reportData, failureReason } }
    const results = data.results && typeof data.results === 'object' ? data.results : data;
    const reportData = results.reportData;
    let dataArray = [];
    let columns = [];

    if (reportData != null) {
      if (Array.isArray(reportData)) {
        dataArray = reportData;
        if (dataArray[0] && typeof dataArray[0] === 'object' && !Array.isArray(dataArray[0])) columns = Object.keys(dataArray[0]);
        else if (Array.isArray(dataArray[0])) columns = results.columnNames || results.columns || data.columnNames || dataArray[0] || [];
      } else if (typeof reportData === 'object') {
        dataArray = reportData.data || reportData.rows || reportData.values || [];
        columns = reportData.columnNames || reportData.columns || reportData.columnNamesList || [];
        if (!Array.isArray(dataArray) || dataArray.length === 0) {
          for (const key of Object.keys(reportData)) {
            const val = reportData[key];
            if (Array.isArray(val) && val.length > 0) {
              dataArray = val;
              if (!columns.length && key !== 'columnNames' && key !== 'columns') columns = reportData.columnNames || reportData.columns || (Array.isArray(val[0]) ? val[0] : (val[0] && typeof val[0] === 'object' ? Object.keys(val[0]) : []));
              break;
            }
          }
        }
        if (!columns.length) columns = reportData.columnNames || reportData.columns || [];
      }
    }
    if (!Array.isArray(dataArray)) dataArray = [];
    if (!Array.isArray(columns)) columns = [];

    const payload = {
      columnNames: columns,
      data: dataArray,
      _status: results.status,
      _failureReason: results.failureReason || null,
      _requestId: results.requestId || null,
      _debug: {
        topLevelKeys: Object.keys(data),
        resultsKeys: results ? Object.keys(results) : [],
        reportDataType: reportData == null ? null : Array.isArray(reportData) ? 'array' : typeof reportData,
        reportDataLength: Array.isArray(reportData) ? reportData.length : (reportData && typeof reportData === 'object' && reportData.data ? (reportData.data.length || 0) : 0),
        dataLength: Array.isArray(dataArray) ? dataArray.length : 0,
        columnNamesLength: Array.isArray(columns) ? columns.length : 0,
        firstRowType: Array.isArray(dataArray) && dataArray[0] != null ? typeof dataArray[0] : null,
        firstRowKeys: Array.isArray(dataArray) && dataArray[0] && typeof dataArray[0] === 'object' && !Array.isArray(dataArray[0]) ? Object.keys(dataArray[0]) : null,
      },
    };
    res.setHeader('Cache-Control', 'private, max-age=0');
    return res.status(200).json(payload);
  } catch (err) {
    console.error('Ashby report fetch error:', err.message);
    return res.status(500).json({
      error: 'Failed to fetch report',
      message: err.message,
    });
  }
};
