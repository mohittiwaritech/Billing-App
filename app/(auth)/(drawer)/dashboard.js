import {
    FlatList,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
    View
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LineChart } from "react-native-chart-kit";
import useStore from "../../../components/store/useStore";

export default function Dashboard(){

const { width } = useWindowDimensions();
const isMobile = width < 600;

const { products, categories, customers, sales } = useStore();

/* SALES CALCULATION */

const today = new Date().toDateString();

const todaySales = sales
.filter(s => new Date(s.date).toDateString() === today)
.reduce((sum,s)=>sum+s.total,0);

const last7Days = sales
.filter(s => (new Date() - new Date(s.date)) <= 7*24*60*60*1000)
.reduce((sum,s)=>sum+s.total,0);

const last30Days = sales
.filter(s => (new Date() - new Date(s.date)) <= 30*24*60*60*1000)
.reduce((sum,s)=>sum+s.total,0);

/* GRAPH DATA */

const last7DaysData = [0,0,0,0,0,0,0];

sales.forEach(s=>{
const daysAgo = Math.floor((new Date() - new Date(s.date)) / (24*60*60*1000));

if(daysAgo < 7){
last7DaysData[6-daysAgo] += s.total;
}
});

/* TOP PRODUCTS */

const itemMap = {};

sales.forEach(s=>{
s.items.forEach(i=>{
if(!itemMap[i.name]) itemMap[i.name]=0;
itemMap[i.name]+=i.qty;
});
});

const topItems = Object.entries(itemMap)
.sort((a,b)=>b[1]-a[1])
.slice(0,5);

return(

<ScrollView style={styles.container}>

{/* SALES ANALYTICS */}

<View style={styles.headerRow}>

<Text style={styles.section}>Sales Analytics</Text>

<TouchableOpacity onPress={()=>router.push("/salesorders")}>
<Text style={styles.seeMore}>See More</Text>
</TouchableOpacity>

</View>

<View style={styles.row}>

<Card icon="today-outline" color="#6366f1" title="Today" value={todaySales} filter="today" isMobile={isMobile}/>

<Card icon="calendar-outline" color="#22c55e" title="7 Days" value={last7Days} filter="7days" isMobile={isMobile}/>

<Card icon="stats-chart-outline" color="#f59e0b" title="30 Days" value={last30Days} filter="30days" isMobile={isMobile}/>

</View>

{/* SALES GRAPH */}

<Text style={styles.section}>Sales Graph</Text>

<LineChart
data={{
labels:["Mon","Tue","Wed","Thu","Fri","Sat","Sun"],
datasets:[{ data:last7DaysData }]
}}
width={width-32}
height={220}
chartConfig={{
backgroundColor:"#fff",
backgroundGradientFrom:"#fff",
backgroundGradientTo:"#fff",
decimalPlaces:0,
color:(opacity=1)=>`rgba(99,102,241,${opacity})`,
labelColor:(opacity=1)=>`rgba(0,0,0,${opacity})`
}}
style={{
marginVertical:12,
borderRadius:12
}}
/>

{/* BUSINESS OVERVIEW */}

<Text style={styles.section}>Business Overview</Text>

<View style={styles.row}>

<StatCard icon="cube-outline" title="Products" value={products.length} link="/products" isMobile={isMobile}/>

<StatCard icon="people-outline" title="Customers" value={customers.length} link="/customers" isMobile={isMobile}/>

<StatCard icon="grid-outline" title="Categories" value={categories.length} link="/categories" isMobile={isMobile}/>

</View>

{/* TOP SELLING */}

<Text style={styles.section}>Top Selling Products</Text>

<FlatList
data={topItems}
scrollEnabled={false}
keyExtractor={(item)=>item[0]}
renderItem={({item})=>(

<View style={styles.topCard}>

<Ionicons name="flame" size={20} color="#f97316"/>

<View style={{flex:1,marginLeft:12}}>

<Text style={styles.productName}>{item[0]}</Text>

<Text style={styles.productQty}>
Sold {item[1]} times
</Text>

</View>

<Text style={styles.qty}>x{item[1]}</Text>

</View>

)}
/>

</ScrollView>

);
}

/* ANALYTICS CARD */

function Card({icon,color,title,value,filter,isMobile}){

return(

<TouchableOpacity
style={[styles.card,{width:isMobile?"48%":"31%"}]}
onPress={()=>router.push({
pathname:"/salesorders",
params:{filter}
})}
>

<Ionicons name={icon} size={26} color={color}/>

<Text style={styles.cardTitle}>{title}</Text>

<Text style={styles.number}>₹{value}</Text>

</TouchableOpacity>

);

}

/* BUSINESS CARD */

function StatCard({icon,title,value,link,isMobile}){

return(

<TouchableOpacity
style={[styles.card,{width:isMobile?"48%":"31%"}]}
onPress={()=>router.push(link)}
>

<Ionicons name={icon} size={26} color="#6366f1"/>

<Text style={styles.cardTitle}>{title}</Text>

<Text style={styles.number}>{value}</Text>

</TouchableOpacity>

);

}

const styles = StyleSheet.create({

container:{
flex:1,
padding:16,
backgroundColor:"#f1f5f9"
},

headerRow:{
flexDirection:"row",
justifyContent:"space-between",
alignItems:"center"
},

seeMore:{
color:"#6366f1",
fontWeight:"600"
},

section:{
fontSize:18,
fontWeight:"700",
marginTop:20
},

row:{
flexDirection:"row",
flexWrap:"wrap",
justifyContent:"space-between",
marginTop:12
},

card:{
backgroundColor:"#fff",
padding:18,
borderRadius:14,
alignItems:"center",
shadowColor:"#000",
shadowOpacity:0.08,
shadowRadius:6,
elevation:3,
marginBottom:12
},

cardTitle:{
fontSize:13,
color:"#64748b",
marginTop:6
},

number:{
fontSize:20,
fontWeight:"700",
marginTop:4
},

topCard:{
flexDirection:"row",
alignItems:"center",
backgroundColor:"#fff",
padding:16,
borderRadius:14,
marginTop:10,
shadowColor:"#000",
shadowOpacity:0.08,
shadowRadius:6,
elevation:3
},

productName:{
fontSize:15,
fontWeight:"600"
},

productQty:{
fontSize:12,
color:"#64748b"
},

qty:{
fontWeight:"700",
fontSize:14
}

});