import { vuexfireMutations, firestoreAction } from 'vuexfire'
import { GeoCollectionReference, GeoFirestore } from 'geofirestore'
import shuffle from 'lodash.shuffle'
export const state = () => ({
	merchants: [],
	merchant_info: {
		d: {
			menu: []
		}
	},
	categories: [],
	food: [],
	fare: [null]
})

export const getters = {
	getMerchantInfo(state) {
		return state.merchant_info
	},

	getCategories(state) {
		return state.merchant_info.d.menu
	},
	getFare(state){
		if(state.fare.length>0)
			return state.fare[0]
		else
			return []
	}
}

export const actions = {
	getMerchantList: firestoreAction(async function({ bindFirestoreRef }) {
		var firestore = this.$fireStoreObj()
		return bindFirestoreRef('merchants', firestore.collection('merchant'), {
			wait: true,
			maxRefDepth: 5
		})
	}),

	getFoodByMerchant: firestoreAction(async function(
		{ bindFirestoreRef },
		data
	) {
		var firestore = this.$fireStoreObj()
		var owner = firestore.collection('merchants').doc(data.merchant_id)
		var ref = firestore.collection('foods').where('owner', '==', owner)
		return bindFirestoreRef('food', ref, { wait: true, maxRefDepth: 5 })
	}),

	getMerchantbyID: firestoreAction(async function({ bindFirestoreRef }, data) {
		var firestore = this.$fireStoreObj()
		var owner = firestore.collection('merchant').doc(data.merchant_id)
		return bindFirestoreRef('merchant_info', owner, {
			wait: true,
			maxRefDepth: 5
		})
	}),

	getArea: firestoreAction(async function({ bindFirestoreRef }, data) {
		var firestore = this.$fireStoreObj()

		var geocollection = new GeoCollectionReference(
			firestore.collection('areas')
		)
		const query = geocollection
			.near({
				center: new this.$fireStoreObj.GeoPoint(data.lat, data.lng),
				radius: 15
			})
		return bindFirestoreRef('fare', query)
	})
}
