
window.addEventListener('load', () => {
    const { Client, BinaryEncoder, Codec, Int16Codec, LongIntCodec, BooleanCodec, StringCodec } = netcode;

    // Register your events
    const encoder = new BinaryEncoder([
        ['open', new Codec()],
        ['id', new Int16Codec()],
        ['ping', new LongIntCodec(6)],
        ['pong', new LongIntCodec(6)],
        ['inverse', new BooleanCodec()],
        ['greeting', new StringCodec()],
    ]);

    // Create the client
    const client = new Client('ws://localhost:8002', encoder);
    let ping;

    // Listen for a "pong" event
    client.addEventListener('pong', pong => {
        console.info('pong: %s ms', pong - ping);
    });

    // Listen for an "id" event
    client.addEventListener('id', id => {
        console.log('connected with id %s', id);
        ping = Date.now();

        // Send a "ping" event
        client.send('ping', ping);
    });

    // Listen for an "inverse" event
    client.addEventListener('inverse', status => {
        // Answer with an "inverse" event
        client.send('inverse', !status);
        console.log('Inverse received: %s', status);

        // Send a "greeting" event
        client.send('greeting', 'Hello, I\'m client!');
    });

    // Listen for a "greeting" event
    client.addEventListener('greeting', message => {
        console.log('Servers geets you: "%s"', message);
    });

    // Listen for oppening connection
    client.addEventListener('open', () => {
        console.info('Connection open.');
    });
});