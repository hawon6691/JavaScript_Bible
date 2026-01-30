/**
 * Date Utility Module
 *
 * What: 날짜 관련 유틸리티 함수
 * Why: 날짜 형식 변환 로직 통합
 * How: ISO 8601 형식으로 일관된 변환
 */

/**
 * Date 객체를 ISO 8601 문자열로 변환
 *
 * @param {Date|string} date - 변환할 날짜
 * @returns {string} ISO 8601 형식 문자열
 */
function formatDate(date) {
  if (date instanceof Date) {
    return date.toISOString();
  }
  return date;
}

/**
 * 현재 시간을 ISO 8601 문자열로 반환
 *
 * @returns {string} ISO 8601 형식 문자열
 */
function now() {
  return new Date().toISOString();
}

module.exports = {
  formatDate,
  now
};
