export default {
  button: {
    border: 'none',
    cursor: 'pointer',
    margin: '10px 0',
    outline: 'none',
    padding: '15px',
    fontWeight: 'bold',
    // backgroundColor: '#4CAF50', // Green color for success
    color: '#000000', // White text color
    borderRadius: '5px', // Rounded corners
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Box shadow for depth
    transition: 'background-color 0.3s ease', // Smooth transition
  },
  customStyles: {
    content: {
      width: '50%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#FFF', // White background color
      boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Box shadow for depth
      padding: '20px', // Increased padding for space
      borderRadius: '10px', // Rounded corners
    },
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  mr20: {
    marginRight: '20px',
  },
  ml20: {
    marginLeft: '20px',
  },
};
