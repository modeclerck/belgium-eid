# BeID Reader for NodeJs

## API

### Class: Reader

The Reader object is an EventEmitter that notifies the existence of cards.

#### Event: 'card-inserted'

* *Card* `Card Object`. A Card object associated to the reader.

Emitted whenever a new card is inserted.

#### Event: 'card-removed'

* *Card* `Card Object`. A Card object associated to the reader.

Emitted whenever a new card is removed.