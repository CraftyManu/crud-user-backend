const calcularEdad = async (users) => {
  const today = new Date();

  // Cuando busco por id es un único objeto -> convertirlo en array
  const userList = Array.isArray(users) ? users : [users];

  for (const user of userList) {
    const birthDate = new Date(user.fechaNacimiento);
    let edad = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      edad--;
    }

    user.edad = edad;
  }

  /* return users; */
  //Devolver el mismo tipo de variable que fue recibida (objeto vs. array):
  return Array.isArray(users) ? userList : userList[0];
};

export default calcularEdad;
