export const STATES = {
  WELCOME: 'STATE_WELCOME',
  CAKE: 'STATE_CAKE',
  MEMORIES: 'STATE_MEMORIES',
  LETTER: 'STATE_LETTER'
};

class StateMachine {
  constructor() {
    this.currentState = STATES.WELCOME;
    this.listeners = new Set();
    this.completedStates = new Set();
  }

  getState() {
    return this.currentState;
  }

  isCompleted(state) {
    return this.completedStates.has(state);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  transitionTo(newState, payload = {}) {
    if (this.currentState === newState) return false;

    // Validate sequential progression rules if needed
    const oldState = this.currentState;
    this.completedStates.add(oldState);
    this.currentState = newState;

    console.log(`[StateMachine] Transition: ${oldState} -> ${newState}`);

    this.listeners.forEach(callback => {
      try {
        callback(newState, oldState, payload);
      } catch (err) {
        console.error('[StateMachine] Listener error:', err);
      }
    });

    return true;
  }
}

export const stateMachine = new StateMachine();
export default stateMachine;
