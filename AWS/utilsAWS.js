const awscrt = require('aws-crt');
const iot = awscrt.iot;
const mqtt = awscrt.mqtt;


/*
 * Arguments specific to sending a message to a topic multiple times.  We have multiple samples that use these arguments.
 */
function add_topic_message_arguments(yargs) {
    yargs
        .option('topic', {
            alias: 't',
            description: 'Topic to publish to (optional).',
            type: 'string',
            default: 'test/topic'
        })
        .option('count', {
            alias: 'n',
            default: 1000,
            description: 'Number of messages to publish/receive before exiting. ' +
                'Specify 0 to run forever (optional).',
            type: 'number',
            required: false
        })
        .option('message', {
            alias: 'M',
            description: 'Message to publish (optional).',
            type: 'string',
            default: 'Hello world!'
        })
}

/*
 * Build a direct mqtt connection using mtls
 */
function buildMqttConnection(argv) {
    let config_builder = iot.AwsIotMqttConnectionConfigBuilder.new_mtls_builder_from_path(argv.CERT, argv.KEY);

    if (argv.CA_FILE != null) {
        config_builder.with_certificate_authority_from_path(undefined, argv.CA_FILE);
    }

    config_builder.with_clean_session(false);
    config_builder.with_client_id(argv.CLIENT_ID || "test-" + Math.floor(Math.random() * 100000000));
    config_builder.with_endpoint(argv.ENDPOINT);
    config_builder.with_keep_alive_seconds(6);

    const config = config_builder.build();

    const client = new mqtt.MqttClient();
    return client.new_connection(config);
}

exports.add_topic_message_arguments = add_topic_message_arguments;
exports.buildMqttConnection = buildMqttConnection;