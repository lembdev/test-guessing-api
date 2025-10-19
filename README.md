# Number Guessing Game API

A real-time multiplayer number guessing game built with NestJS and WebSocket. Players create or join rooms, make guesses between 1-100, and compete to find the secret number.

## Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

The server runs on port 3000 by default (configurable via `APP_PORT` environment variable).

## How to Create a Room

To create a new game room:

**Send this command:**

```json
{
  "command": "room-create",
  "data": {
    "roomName": "My Game Room"
  }
}
```

**You'll receive:**

```json
{
  "event": "room-created",
  "payload": {
    "roomUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0V"
  }
}
```

- `roomName` is optional (max 64 characters)
- `roomUuid` is a ULID that uniquely identifies your room

## How to Get Room List

To see all available rooms:

**Send this command:**

```json
{
  "command": "room-get-list"
}
```

**You'll receive:**

```json
{
  "event": "room-list-updated",
  "payload": {
    "roomList": [
      {
        "roomUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0V",
        "roomName": "My Game Room",
        "players": [
          {
            "playerUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0W",
            "playerName": "Player1"
          }
        ]
      }
    ]
  }
}
```

## How to Join a Room

To join an existing room:

**Send this command:**

```json
{
  "command": "room-join",
  "data": {
    "roomUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0V"
  }
}
```

**You'll receive:**

```json
{
  "event": "room-player-joined",
  "payload": {
    "playerUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0W",
    "playerName": "Player1"
  }
}
```

All players in the room will receive this event when someone joins.

## How to Make a Guess

To submit your guess (must be between 1-100):

**Send this command:**

```json
{
  "command": "make-guess",
  "data": {
    "guess": 42
  }
}
```

**You'll receive:**

```json
{
  "event": "room-user-made-guess",
  "payload": {
    "playerUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0W"
  }
}
```

All players in the room will be notified when someone makes a guess.

## How to Show Results

To see the results of all guesses compared to the secret number:

**Send this command:**

```json
{
  "command": "show-results"
}
```

**You'll receive:**

```json
{
  "event": "room-results",
  "payload": [
    {
      "playerUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0W",
      "result": "higher"
    },
    {
      "playerUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0X",
      "result": "correct"
    }
  ]
}
```

Possible results:

- `"correct"` - Your guess matches the secret number
- `"higher"` - Your guess is higher than the secret number
- `"lower"` - Your guess is lower than the secret number
- `"not guessed"` - You haven't made a guess yet

## How to Reset Secret Number

To generate a new secret number for the current room:

**Send this command:**

```json
{
  "command": "reset-secret"
}
```

**You'll receive:**

```json
{
  "event": "room-number-reset",
  "payload": {
    "resetBy": "01HZ8X9K2M3N4P5Q6R7S8T9U0W"
  }
}
```

All players in the room will be notified that the secret number has been reset.

## How to Leave a Room

To leave your current room:

**Send this command:**

```json
{
  "command": "room-leave"
}
```

**You'll receive:**

```json
{
  "event": "room-player-left",
  "payload": {
    "playerUuid": "01HZ8X9K2M3N4P5Q6R7S8T9U0W"
  }
}
```

If you're the last player in the room, the room will be automatically deleted.

## Error Handling

If something goes wrong, you'll receive an error event:

**You'll receive:**

```json
{
  "event": "error",
  "payload": {
    "command": "make-guess",
    "error": {
      "message": "Player not in room",
      "statusCode": 400
    }
  }
}
```

## Complete Game Flow Example

Here's a typical game session:

1. **Connect to server**
2. **Create a room:**

   ```json
   { "command": "room-create", "data": { "roomName": "Test Game" } }
   ```

   → Receive `room-created` with `roomUuid`

3. **Share roomUuid with other players**

4. **Other players join:**

   ```json
   { "command": "room-join", "data": { "roomUuid": "your-room-uuid" } }
   ```

   → Everyone receives `room-player-joined`

5. **Players make guesses:**

   ```json
   { "command": "make-guess", "data": { "guess": 50 } }
   ```

   → Everyone receives `room-user-made-guess`

6. **Show results:**

   ```json
   { "command": "show-results" }
   ```

   → Everyone receives `room-results` with correct/higher/lower

7. **Reset for new round:**
   ```json
   { "command": "reset-secret" }
   ```
   → Everyone receives `room-number-reset`

## Data Types

- **Guess**: Number between 1-100 (inclusive)
- **Player Name**: String 1-32 characters
- **Room Name**: String 1-64 characters (optional)
- **UUIDs**: ULID format (e.g., "01HZ8X9K2M3N4P5Q6R7S8T9U0V")
- **Socket ID**: UUID format for WebSocket connections

## Notes

- You must be in a room to make guesses, show results, or reset the secret number
- Rooms are automatically deleted when the last player leaves
- All events are broadcast to all players in the same room
- The secret number is generated randomly between 1-100 for each room
