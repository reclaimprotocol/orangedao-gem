// eslint-disable-next-line import/no-anonymous-default-export
export default {
    Button: {
        baseStyle: {
            borderRadius: '16px',
        },
        variants: {
            primary: {
                background: 'linear-gradient(90deg, #FB870D 0%, #EA7826 100%)',
                boxShadow: '0px 1px 4px rgba(12, 12, 13, 0.1)',
                borderRadius: "16px",
                color: 'white',
                width: "178px",
                height: "56px",
                transition: ".3s ease-in-out",
                _hover: { background: 'linear-gradient(90deg, #fc8303 0%, #FB870D 100%)'},
                _active: {background: 'linear-gradient(90deg, #FB870D 0%, #fc8303 100%)'},
            }
        }
    }
}