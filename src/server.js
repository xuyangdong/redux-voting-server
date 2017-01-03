import Server from 'socket.io'

export function startServer(store) {
	const io = Server()

	store.subscribe(
		() => io.emit('state', store.getState().toJS())
	)

	io.on('connection', (socket) => {
		socket.emit('state', store.getState().toJS())
		socket.on('action', store.dispatch.bind(store))
	})

	io.listen(8090)
}