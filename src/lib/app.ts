import { browser } from "$app/environment";
import {
  nip19,
  nip05,
  generatePrivateKey,
  SimplePool,
  finishEvent,
  Kind,
} from "nostr-tools";

const pool = new SimplePool();

export interface Config {
  client: string;
  auto: boolean;
}

export interface CheckKey {
  id: string;
  type: string;
}

export const checkNip19 = (nip19_key: string): CheckKey | null => {
  try {
    let object = nip19.decode(nip19_key);
    return {
      id: nip19_key,
      type: object.type,
    };
  } catch {
    console.info("NIP-19 Parse error.");
    return null;
  }
};

export const checkNip05 = async (userKey: string): Promise<CheckKey | null> => {
  try {
    const profile = await nip05.queryProfile(userKey);
    if (!profile) throw "error";
    return {
      id: userKey,
      type: "user",
    };
  } catch {
    console.info("NIP-05 Parse error.");
    return null;
  }
};

export const createProfile = async (profile: any, pvKey: string) => {
  const ev = {
    kind: Kind.Metadata,
    content: JSON.stringify(profile),
    tags: [],
    created_at: currUnixtime(),
  };
  const post = finishEvent(ev, pvKey);
  const okList: string[] = [];
  const pub = pool.publish(relayList, post);
  pub.on("ok", (relay: string) => {
    okList.push(relay);
    console.log(relay);
  });
  return okList;
};

export const sendToRelayList = async (pvKey: string) => {
  const post = (kind: number) => {
    const ev = {
      kind: kind,
      content: "",
      tags: [
        ["r", "wss://relay-jp.nostr.wirednet.jp"],
        ["r", "wss://yabu.me"],
        ["r", "wss://nostr.holybea.com"],
        ["r", "wss://nrelay-jp.c-stellar.net"],
        ["r", "wss://r.kojira.io"],
        ["r", "wss://relay-jp.shino3.net"],
        ["r", "wss://nostr-relay.nokotaro.com"],
        ["r", "wss://relay.nostr.wirednet.jp"],
      ],
      created_at: currUnixtime(),
    };
    const post = finishEvent(ev, pvKey);
    const okList: string[] = [];
    const pub = pool.publish(relayList, post);
    pub.on("ok", (relay: string) => {
      okList.push(relay);
      console.log(relay);
    });
  }
  post(Kind.RelayList)
  post(Kind.Contacts);
};

export const relayList = [
  "wss://relay-jp.nostr.wirednet.jp",
  "wss://yabu.me",
  "wss://nostr.holybea.com",
  "wss://nrelay-jp.c-stellar.net",
  "wss://r.kojira.io",
  "wss://relay-jp.shino3.net",
  "wss://nostr-relay.nokotaro.com",
  "wss://relay.nostr.wirednet.jp",
  "wss://nos.lol",
  "wss://relay.damus.io",
  "wss://relay.snort.social",
];

export const currUnixtime = (): number =>
  Math.floor(new Date().getTime() / 1000);
