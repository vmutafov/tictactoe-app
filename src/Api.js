class Api {

    constructor(authToken) {
      this.authToken = authToken;
    }
  
    headers = {
      'Accept': 'application/json',
      'Access-Control-Request-Method': 'GET/POST/OPTIONS',
      'Content-Type': 'application/json'
    };
  
    BASE_URL = 'https://fathomless-wildwood-93927.herokuapp.com/api/games';
  
    createHeaders() {
      return this.authToken ? {
        ...this.headers,
        'Authorization': 'Bearer ' + this.authToken
      } : this.headers;
    }
  
    async getAllGames() {
      return await fetch(this.BASE_URL, {
        method: 'GET',
        headers: this.createHeaders()
      });
    }
  
    async getGameById(id) {
      return await fetch(`${this.BASE_URL}/${id}`, {
        method: 'GET',
        headers: this.createHeaders()
      });
    }
  
    async makeMove(gameId, layerId, rowId, columnId) {
      const url = `${this.BASE_URL}/${gameId}`;
      return await fetch(url, {
        method: 'PATCH',
        headers: this.createHeaders(),
        body: JSON.stringify({
          layerId: layerId,
          rowId: rowId,
          columnId: columnId
        })
      });
    }
  
    async createGame(cellsCount) {
      return await fetch(this.BASE_URL, {
        method: 'PUT',
        headers: this.createHeaders(),
        body: JSON.stringify({
          cellsCount: cellsCount
        })
      });
    }
  }
  
  export default Api;