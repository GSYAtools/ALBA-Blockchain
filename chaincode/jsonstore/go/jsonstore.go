package main

import (
	"fmt"

	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

type SmartContract struct {
	contractapi.Contract
}

func (s *SmartContract) StoreData(ctx contractapi.TransactionContextInterface, jsonData string) (string, error) {
	txID := ctx.GetStub().GetTxID()
	err := ctx.GetStub().PutState(txID, []byte(jsonData))
	if err != nil {
		return "", fmt.Errorf("failed to store data: %v", err)
	}
	return txID, nil
}

func (s *SmartContract) GetDataByTxID(ctx contractapi.TransactionContextInterface, txID string) (string, error) {
	data, err := ctx.GetStub().GetState(txID)
	if err != nil {
		return "", fmt.Errorf("failed to read from world state: %v", err)
	}
	if data == nil {
		return "", fmt.Errorf("no data found for txID %s", txID)
	}
	return string(data), nil
}

func main() {
	chaincode, err := contractapi.NewChaincode(&SmartContract{})
	if err != nil {
		panic(fmt.Sprintf("Error creating chaincode: %v", err))
	}

	if err := chaincode.Start(); err != nil {
		panic(fmt.Sprintf("Error starting chaincode: %v", err))
	}
}
