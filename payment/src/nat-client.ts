import nats, { Stan } from "node-nats-streaming";

export class natWrapper {
  public _client?: Stan;

  public get client() {
    if (!this._client) {
      throw new Error("cannot connec to NATS");
    }
    return this._client;
  }

  connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });
    return new Promise((resolve, reject) => {
      this.client.on("connect", () => {
        console.log("Nat server connect");
        resolve();
      });

      this.client.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natConnection = new natWrapper();
