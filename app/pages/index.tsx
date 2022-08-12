import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomePage from "@app/pages/home";

const Stack = createNativeStackNavigator();

const Pages = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default Pages;
