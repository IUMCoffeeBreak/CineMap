import React from "react";
import {SafeAreaView, ScrollView, StyleSheet, Text, View} from "react-native";
import {Avatar} from 'react-native-elements';
import Icons from "react-native-vector-icons/FontAwesome";
import Carousel from "../../lib/components/Carousel";

export function ProfileTab() {
    return (
        <SafeAreaView style={style.mainContainer}>
            <ScrollView>
                <View style={style.headerContainer}>
                    <View style={style.avatarInfoContainer}>
                        <Avatar
                                rounded
                                title='CB'
                                size={100}
                                activeOpacity={0.7}
                                containerStyle={{backgroundColor:'black'}}
                                titleStyle={{color: 'yellow'}}
                        />
                        <View style={style.userInfoContainer}>
                            <Text style={style.userName}>
                                Coffee Break
                            </Text>
                            <Text style={style.userTag}>
                                @coffeebreak
                            </Text>
                        </View>
                    </View>
                    <View style={style.infoContainer}>
                        <View style={style.infoRowContainer}>
                            <Icons name={'map-marker'} size={20} style={style.infoRowIcon}/>
                            <Text style={style.infoRowText}>Rome, Italy</Text>
                        </View>
                        <View style={style.infoRowContainer}>
                            <Icons name={'at'} size={20} style={style.infoRowIcon}/>
                            <Text style={style.infoRowText}>mail</Text>
                        </View>
                        <View style={style.infoRowContainer}>
                            <Icons name={'github'} size={20} style={style.infoRowIcon}/>
                            <Text style={style.infoRowText}>Page</Text>
                        </View>
                    </View>
                </View>

                <View style={style.bodyContainer}>
                    <View style={style.badgesContainer}>
                        <View style={style.firstBadge}>
                            <Icons name={'registered'} size={30} style={style.badgeBadge}/>
                            <Text style={style.badgesText}>451</Text>
                        </View>
                        <View style={style.secondBadge}>
                            <Icons name={'share'} size={30} style={style.badgeBadge}/>
                            <Text style={style.badgesText}>27</Text>
                        </View>
                    </View>
                </View>

                <View style={style.footerContainer}>
                    <View style={style.footerRowContainer}>
                        <Icons name={'heart'} size={25} style={style.footerRowIcon}/>
                        <Text style={style.footerRowText}>Favourite Film</Text>
                    </View>
                    <View style={style.footerRowContainer}>
                        <Icons name={'map-marker'} size={25} style={style.footerRowIcon}/>
                        <Text style={style.footerRowText}>Favourite Locations</Text>
                    </View>
                    <View style={style.footerRowContainer}>
                        <Icons name={'paperclip'} size={25} style={style.footerRowIcon}/>
                        <Text style={style.footerRowText}>Related Posts</Text>
                    </View>
                    <View style={style.footerRowContainer}>
                        <Icons name={'cogs'} size={25} style={style.footerRowIcon}/>
                        <Text style={style.footerRowText}>Setting</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
const style = StyleSheet.create({
        mainContainer:{
        flex:1,
        justifyContent: 'space-around',
    },
    headerContainer: {
        flex: 1,
        alignItems: "flex-start",
        padding: '5%',
        width: '100%',
        borderRadius: 20,
        backgroundColor: 'white',
        margin: '5%',
        elevation: 5
    },
    avatarInfoContainer: {
        flexDirection: 'row',
    },
    userInfoContainer: {
        margin: '5%',
        alignItems: "flex-start"
    },
    userName:{
        fontSize: 25,
        fontWeight: 'bold',
        fontStyle: 'italic'
    },
    userTag:{
        fontSize: 15,
        fontStyle: 'italic',
        color: 'grey'
    },
    infoContainer:{
        flex:1,
    },
    infoRowContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    infoRowIcon:{
        margin: 10,
        color : 'grey'
    },
    infoRowText:{
        margin: 10,
        fontSize: 15,
        color: 'grey'
    },
    bodyContainer:{
        flex: 1,
        alignItems: "flex-start",
        width: '100%',
        borderRadius: 20
    },
    badgesContainer:{
        flexDirection: 'row',
        alignItems: 'center',
    },
    firstBadge:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderEndWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'grey'
    },
    secondBadge: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'grey'

    },
    badgeBadge:{
        margin: '5%'
    },
    badgesText:{
        fontSize: 25,
        fontWeight: 'bold',
        margin: '5%'
    },
    footerContainer:{
        flex: 1,
        borderRadius: 20,
        borderBottomStartRadius: 0,
        borderTopStartRadius: 0,
        padding: '5%',
        backgroundColor: 'white',
        marginEnd: '5%',
        marginTop: '5%',
        elevation: 5
    },
    footerRowContainer:{
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    footerRowIcon: {
        margin: 10,
        color : 'red'
    },
    footerRowText:{
        margin: 10,
        fontSize: 20,
        color: 'black'
    },
})
