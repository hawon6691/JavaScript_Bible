/**
 * UUID Generator Module
 *
 * What: UUID v4 생성 유틸리티
 * Why: 각 Todo에 고유한 식별자를 부여하기 위해
 * How: Node.js 내장 crypto 모듈의 randomUUID 사용
 */

const crypto = require('crypto');

/**
 * UUID v4 형식의 고유 식별자 생성
 * @returns {string} UUID v4 형식의 문자열
 */
function generateUUID() {
  return crypto.randomUUID();
}

module.exports = {
  generateUUID
};
