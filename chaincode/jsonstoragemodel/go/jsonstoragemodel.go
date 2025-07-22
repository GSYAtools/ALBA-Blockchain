package main

import (
	"encoding/json"
	"fmt"
	"time"

	"github.com/golang/protobuf/ptypes"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

const recordPrefix = "jsonstoragemodel"

type Record struct {
	Tipo      string `json:"tipo"`
	Payload   string `json:"payload"`
	Timestamp string `json:"timestamp"`
}

// JSONStorageModel implementa las funciones del chaincode

type JSONStorageModel struct {
	contractapi.Contract
}

// StoreData guarda en el ledger un registro con tipo, payload y timestamp.
func (c *JSONStorageModel) StoreData(ctx contractapi.TransactionContextInterface, tipo string, payload string) (string, error) {
	txID := ctx.GetStub().GetTxID()

	// Obtener timestamp de la transacción
	ts, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		return "", fmt.Errorf("failed to get tx timestamp: %v", err)
	}
	goTime, err := ptypes.Timestamp(ts)
	if err != nil {
		return "", fmt.Errorf("timestamp conversion failed: %v", err)
	}
	timestamp := goTime.Format(time.RFC3339)

	// Construir registro
	rec := Record{
		Tipo:      tipo,
		Payload:   payload,
		Timestamp: timestamp,
	}
	recBytes, err := json.Marshal(rec)
	if err != nil {
		return "", fmt.Errorf("failed to marshal record: %v", err)
	}

	// Crear composite key: jsonstoragemodel:tipo:txID
	key, err := ctx.GetStub().CreateCompositeKey(recordPrefix, []string{tipo, txID})
	if err != nil {
		return "", fmt.Errorf("failed to create composite key: %v", err)
	}

	// Almacenar en world state
	err = ctx.GetStub().PutState(key, recBytes)
	if err != nil {
		return "", fmt.Errorf("failed to store data: %v", err)
	}

	return txID, nil
}

// GetDataByTxID recupera un registro completo por tipo y txID.
func (c *JSONStorageModel) GetDataByTxID(ctx contractapi.TransactionContextInterface, tipo string, txID string) (*Record, error) {
	// Crear composite key
	key, err := ctx.GetStub().CreateCompositeKey(recordPrefix, []string{tipo, txID})
	if err != nil {
		return nil, fmt.Errorf("failed to create composite key: %v", err)
	}

	data, err := ctx.GetStub().GetState(key)
	if err != nil {
		return nil, fmt.Errorf("failed to read from world state: %v", err)
	}
	if data == nil {
		return nil, fmt.Errorf("no data found for tipo %s, txID %s", tipo, txID)
	}

	var rec Record
	err = json.Unmarshal(data, &rec)
	if err != nil {
		return nil, fmt.Errorf("failed to unmarshal record: %v", err)
	}
	return &rec, nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&JSONStorageModel{})
	if err != nil {
		panic(fmt.Sprintf("Error creating chaincode: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Error starting chaincode: %v", err))
	}
}
