export type Action = Function

export type HTTPMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export type API = {
  [path: string]: {
    [method in HTTPMethod]?: Action
  }
}
