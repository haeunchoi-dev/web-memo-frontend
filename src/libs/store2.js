// Store 생성
function createStore(reducer) {
  let state = undefined;
  const listeners = [];

  // 현재 상태를 반환하는 함수
  function getState() {
    return state;
  }

  // 액션을 dispatch하는 함수
  function dispatch(action) {
    state = reducer(state, action);
    // 상태가 업데이트될 때마다 등록된 리스너 함수들을 호출
    listeners.forEach((listener) => listener());
  }

  // 상태 변화를 감지하는 함수를 등록하는 함수
  function subscribe(listener) {
    listeners.push(listener);
    // 구독 취소 함수 반환
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // 초기 상태 설정
  dispatch({});

  // store 객체 반환
  return {
    getState,
    dispatch,
    subscribe,
  };
}
