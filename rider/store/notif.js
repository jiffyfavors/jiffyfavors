export const state = () => ({
	notifs:[]
})
export const getters = {
	getNotifs(state){
		return state.notifs
	}
}
export const mutations = {
	addNotif(state, data){
		state.notifs.push(data)
	},
	removeNotif(state, data){
		state.notifs.splice(state.notifs.indexOf(data), 1)
	}
}