const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  menuRouteLoaded: state => state.app.menuRouteLoaded,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  hiId_name: state => state.user.hiId_name
}
export default getters
