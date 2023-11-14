export function customScrollBar() {

    const useCustomScrollBar = () => {
        const thumbStyle = {
            right: '4px',
            borderRadius: '5px',
            backgroundColor: '#027be3',
            width: '5px',
            opacity: 0.75
        }

        const barStyle = {
            right: '2px',
            borderRadius: '9px',
            backgroundColor: '#027be3',
            width: '9px',
            opacity: 0.2
        }

        return { thumbStyle, barStyle }
    }

    return {
        useCustomScrollBar
    }
}
