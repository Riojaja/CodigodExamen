export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  authMethod: 'keycloak', // o 'jwt' para cambiar entre métodos
  keycloakConfig: {
    url: 'http://localhost:8180',      // URL de tu servidor Keycloak
    realm: 'hotel-realm',              // Nombre del realm
    clientId: 'hotel-app'              // Nombre del cliente
  }

};