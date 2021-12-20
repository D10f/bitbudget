class SessionStorageService {
  get(key: string): string {
    const value = sessionStorage.getItem(key);
    return value ? JSON.parse(value) : '';
  }

  set(key: string, value: any) {
    return sessionStorage.setItem(key, JSON.stringify(value));
  }

  clear() {
    sessionStorage.clear();
  }
}

export default new SessionStorageService();