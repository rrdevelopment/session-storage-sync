// @ts-ignore
import * as uuid from "uuid/v1";
import {
  ADD_TO_SESSION_STORAGE_KEY,
  CLEAR_SESSION_STORAGE_KEY,
  DELETE_SESSION_STORAGE_KEY,
  GET_SESSION_STORAGE_KEY,
  SESSION_STORAGE_ID,
  SET_SESSION_STORAGE_KEY,
  WINDOW_STORAGE_EVENT
} from "./constants";
import { LocalStorage } from "./LocalStorage";
import { SessionStorage } from "./SessionStorage";
import { StorageMechanism } from "./StorageMechanism";

type EventData = {
  [SESSION_STORAGE_ID]: string;
  key?: string;
  value?: string;
};

export class Storage {
  private _local: LocalStorage;
  private _session: SessionStorage;
  private _ignored: string[];
  private _sessionId: string;
  private _isInitialized: boolean = false;

  public constructor(ignoredKeys: string[] = []) {
    this._sessionId = uuid();
    this._ignored = ([] as string[]).concat(ignoredKeys);
    this._ignored.push(SESSION_STORAGE_ID);

    this._local = new LocalStorage(window.localStorage);
    this._session = new SessionStorage(window.sessionStorage);
    this._session.addEventListener("set", this.onSetItem.bind(this));
    this._session.addEventListener("delete", this.onDeleteItem.bind(this));
    this._session.addEventListener("clear", this.onClearItems.bind(this));

    this.listenForStorageEvents();
  }

  public get local(): StorageMechanism {
    return this._local;
  }

  public get session(): StorageMechanism {
    return this._session;
  }

  private listenForStorageEvents(): void {
    window.addEventListener(
      WINDOW_STORAGE_EVENT,
      (event: StorageEvent) => {
        if (event == null) {
          event = window.event as StorageEvent;
        }

        if (event == null) return;

        const data = event.newValue;

        let parsedData: EventData | null | undefined;
        try {
          parsedData = data && JSON.parse(data);
        } catch {
          // do nothing here
        }
        const eventData = parsedData;

        //ensure our current tab did not send this event
        if (
          eventData != null &&
          eventData[SESSION_STORAGE_ID] === this._sessionId
        )
          return;

        // @ts-ignore
        if (eventData != null) delete eventData[SESSION_STORAGE_ID];

        if (event.key === GET_SESSION_STORAGE_KEY && event.newValue != null) {
          try {
            if (this.session.length > 0) {
              let data: { [key: string]: string } = JSON.parse(
                JSON.stringify(window.sessionStorage)
              );

              //remove any ignored items
              this._ignored.forEach(i => {
                // @ts-ignore
                delete data[i];
              });

              data[SESSION_STORAGE_ID] = this._sessionId;

              this.local.set(SET_SESSION_STORAGE_KEY, JSON.stringify(data));
              this.local.remove(SET_SESSION_STORAGE_KEY);
            }
          } catch {
            this.local.remove(SET_SESSION_STORAGE_KEY);
          }
        } else if (
          event.key === SET_SESSION_STORAGE_KEY &&
          event.newValue != null
        ) {
          try {
            if (this._isInitialized === true) return;
            this._isInitialized = true;
            if (eventData != null) {
              let p: keyof EventData;
              for (p in eventData) {
                window.sessionStorage.setItem(p, eventData[p] ?? "");
              }
            }
          } catch {
            //do nothing here
          }
        } else if (
          eventData?.key &&
          eventData?.value &&
          event.key === ADD_TO_SESSION_STORAGE_KEY &&
          event.newValue != null
        ) {
          window.sessionStorage.setItem(eventData.key, eventData.value);
        } else if (
          eventData?.key &&
          eventData?.value &&
          event.key === DELETE_SESSION_STORAGE_KEY &&
          event.newValue != null
        ) {
          window.sessionStorage.removeItem(eventData.key);
        } else if (
          event.key === CLEAR_SESSION_STORAGE_KEY &&
          event.newValue != null
        ) {
          window.sessionStorage.clear();
        }
      },
      {
        capture: true,
        passive: true
      }
    );

    // check if this is a new window.. if the session storage has nothing we will trigger
    // an event to request session storage from other tab
    if (this.session.length <= 0) {
      this.local.set(
        GET_SESSION_STORAGE_KEY,
        JSON.stringify({
          [SESSION_STORAGE_ID]: this._sessionId
        })
      );
      this.local.remove(GET_SESSION_STORAGE_KEY);
    }
  }

  private onSetItem(key: string, value: string) {
    this.local.set(
      ADD_TO_SESSION_STORAGE_KEY,
      JSON.stringify({
        key: key,
        value: value,
        [SESSION_STORAGE_ID]: this._sessionId
      })
    );
    this.local.remove(ADD_TO_SESSION_STORAGE_KEY);
  }

  private onDeleteItem(key: string) {
    this.local.set(
      DELETE_SESSION_STORAGE_KEY,
      JSON.stringify({
        key: key,
        [SESSION_STORAGE_ID]: this._sessionId
      })
    );
    this.local.remove(DELETE_SESSION_STORAGE_KEY);
  }

  private onClearItems() {
    this.local.set(
      CLEAR_SESSION_STORAGE_KEY,
      JSON.stringify({
        [SESSION_STORAGE_ID]: this._sessionId
      })
    );
    this.local.remove(CLEAR_SESSION_STORAGE_KEY);
  }
}
