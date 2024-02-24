import * as React from 'react';
import {
  Cursor,
  CursorAdapter,
  CursorDescription,
  Player,
  Room,
  RoomMember,
  RoomState,
} from 'white-web-sdk';

export type CursorComponentProps = {
  roomMember: RoomMember;
};

class CursorComponent extends React.Component<CursorComponentProps, {}> {
  public constructor(props: CursorComponentProps) {
    super(props);
  }
  private getTextColor = (roomMember: RoomMember): string | undefined => {
    if (roomMember.payload && roomMember.payload.textColor) {
      return roomMember.payload.textColor;
    } else {
      return undefined;
    }
  };

  private getCursorColor = (roomMember: RoomMember): string | undefined => {
    if (roomMember.payload && roomMember.payload.cursorColor) {
      return roomMember.payload.cursorColor;
    } else {
      return undefined;
    }
  };

  private getCursorName = (roomMember: RoomMember): string | undefined => {
    if (roomMember.payload && roomMember.payload.cursorName) {
      return roomMember.payload.cursorName;
    } else {
      return undefined;
    }
  };

  public render(): React.ReactNode {
    const {roomMember} = this.props;
    const cursorName = this.getCursorName(roomMember);
    return (
      <div style={{position: 'relative'}}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="19"
          viewBox="0 0 15 19"
          fill="none">
          <path
            d="M6 13L1.75926 17.9475C1.15506 18.6524 0 18.2251 0 17.2967V0L13.814 11.2239C14.5447 11.8176 14.1249 13 13.1834 13H6Z"
            fill={this.getCursorColor(roomMember)}
          />
        </svg>
        <div
          style={{
            position: 'absolute',
            backgroundColor: this.getCursorColor(roomMember),
            color: this.getTextColor(roomMember),
            borderRadius: '0 12px 12px 12px',
            padding: '4px 8px 4px 8px',
            top: '20px',
            left: '8px',
            textAlign: 'center',
            fontFamily: 'Source Sans Pro',
            fontSize: '12px',
            fontWeight: '600',
          }}>
          {cursorName}
        </div>
      </div>
    );
  }
}

export class CursorTool implements CursorAdapter {
  private readonly cursors: {[memberId: number]: Cursor} = {};
  private roomMembers: ReadonlyArray<RoomMember> = [];
  private isFirstFrameReady: boolean = false;

  public createCursor(): CursorDescription {
    return {x: 64, y: 64, width: 128, height: 128};
  }

  public onAddedCursor(cursor: Cursor): void {
    for (const roomMember of this.roomMembers) {
      if (
        roomMember.memberId === cursor.memberId &&
        !this.isCursorDisappear(roomMember)
      ) {
        cursor.setReactNode(<CursorComponent roomMember={roomMember} />);
        break;
      }
    }
    this.cursors[cursor.memberId] = cursor;
  }

  public onRemovedCursor(cursor: Cursor): void {
    delete this.cursors[cursor.memberId];
  }

  public onMovingCursor(): void {}

  private isCursorDisappear = (roomMember: RoomMember): boolean => {
    return !!(roomMember.payload && roomMember.payload.disappearCursor);
  };

  public setRoom(room: Room): void {
    this.setColorAndAppliance(room.state.roomMembers);
    room.callbacks.on(
      'onRoomStateChanged',
      (modifyState: Partial<RoomState>): void => {
        if (modifyState.roomMembers) {
          this.setColorAndAppliance(modifyState.roomMembers);
        }
      },
    );
  }

  public setPlayer(player: Player): void {
    if (this.isFirstFrameReady) {
      this.setColorAndAppliance(player.state.roomMembers);
    }
    player.callbacks.on(
      'onPlayerStateChanged',
      (modifyState: Partial<RoomState>): void => {
        if (modifyState.roomMembers) {
          this.setColorAndAppliance(modifyState.roomMembers);
        }
      },
    );
    player.callbacks.on('onLoadFirstFrame', (): void => {
      this.isFirstFrameReady = true;
      this.setColorAndAppliance(player.state.roomMembers);
    });
  }

  private setColorAndAppliance(roomMembers: ReadonlyArray<RoomMember>): void {
    this.roomMembers = roomMembers;
    for (const roomMember of roomMembers) {
      const cursor = this.cursors[roomMember.memberId];
      if (cursor && !this.isCursorDisappear(roomMember)) {
        cursor.setReactNode(<CursorComponent roomMember={roomMember} />);
      }
    }
  }
}
