import { executeSQLQuery } from "../config/dbPoolInfra";

const getAllUsers = () => {
    const query = 'SELECT * FROM "User"';

    return executeSQLQuery(query);
};

export default {
    getAllUsers,
};
