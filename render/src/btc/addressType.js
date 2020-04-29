import { compose, head, either, equals, cond, always, T } from "ramda";

export const addrType = compose(
    cond([
        [either(equals('2'), equals('3')), always('Segwit')],
        [equals('1'), always('pubkey hash')],
        [T, always('unknow')]
    ]),
    head
)