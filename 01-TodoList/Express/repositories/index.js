/**
 * Repository 선택기
 *
 * What: 환경 설정에 따라 적절한 Repository 선택
 * Why: 저장소 변경을 쉽게 하기 위한 추상화
 * How: STORAGE_TYPE 환경변수로 선택
 */

const storageType = process.env.STORAGE_TYPE || 'memory';

let repository;

if (storageType === 'mysql') {
  repository = require('./todoRepository.mysql');
  console.log('  Using MySQL storage');
} else {
  repository = require('./todoRepository');
  console.log('  Using Memory storage');
}

module.exports = repository;
