import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";

const style = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
        fontSize: 18
    }
});

export const CinepinModal: React.FunctionComponent<{ isVisible: boolean; message: string }> = props => {
    return (
        <Modal visible={props.isVisible} transparent={true} animationType={"fade"}>
            <View style={style.centeredView}>
                <View style={style.modalView}>
                    <Text style={style.modalText}>{props.message}</Text>
                    {props.children}
                </View>
            </View>
        </Modal>
    );
};
