/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/light");

var $root = ($protobuf.roots["default"] || ($protobuf.roots["default"] = new $protobuf.Root()))
    .addJSON({
        agora: {
            nested: {
                audio2text: {
                    options: {
                        java_package: "io.agora.rtc.audio2text",
                        java_outer_classname: "Audio2TextProtobuffer"
                    },
                    nested: {
                        Text: {
                            fields: {
                                vendor: {
                                    type: "int32",
                                    id: 1
                                },
                                version: {
                                    type: "int32",
                                    id: 2
                                },
                                seqnum: {
                                    type: "int32",
                                    id: 3
                                },
                                uid: {
                                    type: "uint32",
                                    id: 4
                                },
                                flag: {
                                    type: "int32",
                                    id: 5
                                },
                                time: {
                                    type: "int64",
                                    id: 6
                                },
                                lang: {
                                    type: "int32",
                                    id: 7
                                },
                                starttime: {
                                    type: "int32",
                                    id: 8
                                },
                                offtime: {
                                    type: "int32",
                                    id: 9
                                },
                                words: {
                                    rule: "repeated",
                                    type: "Word",
                                    id: 10
                                }
                            }
                        },
                        Word: {
                            fields: {
                                text: {
                                    type: "string",
                                    id: 1
                                },
                                startMs: {
                                    type: "int32",
                                    id: 2
                                },
                                durationMs: {
                                    type: "int32",
                                    id: 3
                                },
                                isFinal: {
                                    type: "bool",
                                    id: 4
                                },
                                confidence: {
                                    type: "double",
                                    id: 5
                                }
                            }
                        }
                    }
                }
            }
        }
    });

module.exports = $root;
