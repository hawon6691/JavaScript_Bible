/**
 * UUID 생성 유틸리티
 *
 * What: 고유 식별자(UUID) 생성
 * Why: 각 Todo에 고유한 ID 부여
 * How: Node.js 내장 crypto 모듈 사용
 */

const crypto = require('crypto');

/**
 * UUID v4 생성
 *
 * @returns {string} UUID 문자열
 */
function generateUUID() {
  return crypto.randomUUID();
}

module.exports = {
  generateUUID,
};
