const a = {
    toto: {
        key1: "value1",
    },
};

const b = {
    ...a,
    key2: "value2",
};

console.log(b.toto.key1);