const commonColor = {
    colors: {
		commonDark: '#140E08',
		commonLight: '#EAE6E4',
    }
}
  
const light = {
    colors: {
		surface: '#EAE6E4',
		accent: '#140E08',
		screen: '#ffffff',
		tabActive: '#1E140A',
		tabInactive: '#D1D1C3',
		text_color: '#50555C',
		shadow: 'rgb(225,225,225)',
		switch:"#000",
		...commonColor.colors
    }
}
  
const dark = {
    colors: {
		surface: '#140E08',
		accent: '#EAE6E4',
		screen: '#140E08',
		tabActive: '#ffffff',
		tabInactive: '#6F6C60',
		text_color: '#ffffff',
		shadow: 'rgb(5,5,5)',
		switch:"#fff",
		...commonColor.colors
    }
}
  
export default { light, dark }