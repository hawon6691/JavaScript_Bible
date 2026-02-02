/**
 * JSON Parser Middleware
 *
 * What: HTTP 요청 본문의 JSON 파싱
 * Why: POST, PUT, PATCH 요청의 JSON 데이터를 처리
 * How: 스트림으로 데이터를 수집하고 JSON.parse로 파싱
 */

/**
 * 요청 본문을 JSON으로 파싱
 *
 * @param {Object} req - HTTP Request 객체
 * @returns {Promise<Object>} 파싱된 JSON 객체
 * @throws {Error} 잘못된 JSON 형식인 경우
 */
function parseJson(req) {
  return new Promise((resolve, reject) => {
    const contentType = req.headers['content-type'];

    // Content-Type이 없거나 GET, DELETE 요청인 경우 빈 객체 반환
    if (!contentType || !contentType.includes('application/json')) {
      return resolve({});
    }

    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();

      // 요청 크기 제한 (1MB)
      if (body.length > 1048576) {
        reject(new Error('Request body too large'));
      }
    });

    req.on('end', () => {
      // 빈 본문인 경우 빈 객체 반환
      if (!body || body.trim() === '') {
        return resolve({});
      }

      try {
        const parsed = JSON.parse(body);
        resolve(parsed);
      } catch (error) {
        const parseError = new Error('Invalid JSON format');
        parseError.code = 'INVALID_JSON';
        reject(parseError);
      }
    });

    req.on('error', (error) => {
      reject(error);
    });
  });
}

module.exports = {
  parseJson
};
