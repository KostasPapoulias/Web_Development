package DB_tables;

import DB_Connection.Connect;
import mainClasses.Pet;
import com.google.gson.Gson;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Mike
 */
public class EditPetsTable {

    public void addPetFromJSON(String json) throws ClassNotFoundException {
        Pet bt = jsonToPet(json);
        createNewPet(bt);
    }

    public Pet jsonToPet(String json) {
        Gson gson = new Gson();
        Pet btest = gson.fromJson(json, Pet.class);
        return btest;
    }

    public String petToJSON(Pet bt) {
        Gson gson = new Gson();

        String json = gson.toJson(bt, Pet.class);
        return json;
    }

    public ArrayList<Pet> databaseToPets() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets");
            while (rs.next()) {
                String json = DB_Connection.Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Pet> getAllPets() throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<>();
        ResultSet rs = null;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets");
            while (rs.next()) {
                String json = Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (stmt != null) {
                stmt.close();
            }
            if (con != null) {
                con.close();
            }
        }
        return pets;
    }

    public Pet petOfOwner(String id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        Pet pet = new Pet();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE owner_id= '" + id + "'");

            while (rs.next()) {
                String json = DB_Connection.Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                pet = gson.fromJson(json, Pet.class);

            }
            return pet;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<Pet> databaseToPets(String type) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE type= '" + type + "'");

            while (rs.next()) {
                String json = DB_Connection.Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void updatePet(String id, String name) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        Pet bt = new Pet();

        String update = "UPDATE pets SET name='" + name + "'" + "WHERE pet_id = '" + id + "'";
        //stmt.executeUpdate(update);
    }

    public void deletePet(String id) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        String deleteQuery = "DELETE FROM pets WHERE pet_id='" + id + "'";
        stmt.executeUpdate(deleteQuery);
        stmt.close();
        con.close();
    }

    /**
     * Get all pets from the database that belong to a specific owner.
     * @param ownerId
     * @return
     * @throws SQLException
     * @throws ClassNotFoundException
     */
    public ArrayList<Pet> getPetsByOwnerId(String ownerId) throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<Pet> pets = new ArrayList<Pet>();
        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM pets WHERE owner_id= '" + ownerId + "'");
            while (rs.next()) {
                String json = DB_Connection.Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                Pet pet = gson.fromJson(json, Pet.class);
                pets.add(pet);
            }
            return pets;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createPetsTable() throws SQLException, ClassNotFoundException {
        Connection con = DB_Connection.Connect.getConnection();
        Statement stmt = con.createStatement();
        String sql = "CREATE TABLE pets "
                + "(pet_id VARCHAR(10) not NULL unique, "
                + "owner_id INTEGER not null,"
                + "name VARCHAR(30) not null,"
                + "type VARCHAR(3)  not null, "
                + "breed VARCHAR(30)  not null, "
                + "gender VARCHAR(7)  not null, "
                + "birthyear INTEGER not null , "
                + "weight DOUBLE not null , "
                + "description VARCHAR (500), "
                + "photo VARCHAR (300), "
                + "FOREIGN KEY (owner_id) REFERENCES petowners(owner_id), "
                + "PRIMARY KEY (pet_id ))";
        stmt.execute(sql);
        stmt.close();
        con.close();

    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void createNewPet(Pet bt) throws ClassNotFoundException {
        try {
            Connection con = DB_Connection.Connect.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " pets (pet_id,owner_id,name,type,breed,gender,birthyear,weight,description,photo) "
                    + " VALUES ("
                    + "'" + bt.getPet_id() + "',"
                    + "'" + bt.getOwner_id() + "',"
                    + "'" + bt.getName() + "',"
                    + "'" + bt.getType()+ "',"
                    + "'" + bt.getBreed()+ "',"
                    + "'" + bt.getGender()+ "',"
                    + "'" + bt.getBirthyear()+ "',"
                    + "'" + bt.getWeight() + "',"
                    + "'" + bt.getDescription() + "',"
                    + "'" + bt.getPhoto() + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The pet was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditPetsTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }
}
