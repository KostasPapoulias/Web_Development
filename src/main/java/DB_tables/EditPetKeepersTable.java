/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DB_tables;

import DB_Connection.Connect;
import com.google.gson.Gson;
import mainClasses.PetKeeper;

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
public class EditPetKeepersTable {

    public void addPetKeeperFromJSON(String json) throws ClassNotFoundException {
        PetKeeper user = jsonToPetKeeper(json);
        addNewPetKeeper(user);
    }

    public PetKeeper jsonToPetKeeper(String json) {
        Gson gson = new Gson();

        PetKeeper user = gson.fromJson(json, PetKeeper.class);
        return user;
    }

    public String petKeeperToJSON(PetKeeper user) {
        Gson gson = new Gson();

        String json = gson.toJson(user, PetKeeper.class);
        return json;
    }

    public void updatePetKeeper(String username, String personalpage) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE petkeepers SET personalpage='" + personalpage + "' WHERE username = '" + username + "'";
        stmt.executeUpdate(update);
    }

    public void printPetKeeperDetails(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petkeepers WHERE username = '" + username + "' AND password='" + password + "'");
            while (rs.next()) {
                System.out.println("===Result===");
                Connect.printResults(rs);
            }

        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }

    public void deletePetKeeperByUsername(String username) throws ClassNotFoundException {
        Connection con = null;
        Statement stmt = null;
        try {
            con = Connect.getConnection();
            stmt = con.createStatement();
            String deleteQuery = "DELETE FROM petkeepers WHERE username = '" + username + "'";
            stmt.executeUpdate(deleteQuery);
            System.out.println("PetKeeper with username " + username + " was successfully deleted.");
        } catch (SQLException ex) {
            Logger.getLogger(EditPetKeepersTable.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException ex) {
                    Logger.getLogger(EditPetKeepersTable.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                    Logger.getLogger(EditPetKeepersTable.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
    }

    public void updatePetKeeperData(String username, String password, String firstname, String lastname, String telephone, String city, String address, String property, String propertydescription, String catkeeper, String dogkeeper, String catprice, String dogprice) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        StringBuilder updateQuery = new StringBuilder("UPDATE petkeepers SET ");

        if (password != null && !password.isEmpty()) {
            updateQuery.append("password='").append(password).append("',");
        }
        if (firstname != null && !firstname.isEmpty()) {
            updateQuery.append("firstname='").append(firstname).append("',");
        }
        if (lastname != null && !lastname.isEmpty()) {
            updateQuery.append("lastname='").append(lastname).append("',");
        }
        if (telephone != null && !telephone.isEmpty()) {
            updateQuery.append("telephone='").append(telephone).append("',");
        }
        if (city != null && !city.isEmpty()) {
            updateQuery.append("city='").append(city).append("',");
        }
        if (address != null && !address.isEmpty()) {
            updateQuery.append("address='").append(address).append("',");
        }
        if (property != null && !property.isEmpty()) {
            updateQuery.append("property='").append(property).append("',");
        }
        if (propertydescription != null && !propertydescription.isEmpty()) {
            updateQuery.append("propertydescription='").append(propertydescription).append("',");
        }
        if (catkeeper != null && !catkeeper.isEmpty()) {
            updateQuery.append("catkeeper='").append(catkeeper).append("',");
        }
        if (dogkeeper != null && !dogkeeper.isEmpty()) {
            updateQuery.append("dogkeeper='").append(dogkeeper).append("',");
        }
        if (catprice != null && !catprice.isEmpty()) {
            updateQuery.append("catprice='").append(catprice).append("',");
        }
        if (dogprice != null && !dogprice.isEmpty()) {
            updateQuery.append("dogprice='").append(dogprice).append("',");
        }

        // Remove the last comma
        if (updateQuery.charAt(updateQuery.length() - 1) == ',') {
            updateQuery.setLength(updateQuery.length() - 1);
        }

        updateQuery.append(" WHERE username = '").append(username).append("'");
        System.out.println("UPDATE QUERY: " + updateQuery.toString());

        try {
            stmt.executeUpdate(updateQuery.toString());
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }

    public PetKeeper getPetKeeperByUsername(String username) {
        PetKeeper petKeeper = null;
        try {
            Connection con = Connect.getConnection();
            Statement stmt = con.createStatement();
            String query = "SELECT * FROM petkeepers WHERE username = '" + username + "'";
            ResultSet rs = stmt.executeQuery(query);

            if (rs.next()) {
                Gson gson = new Gson();
                String json = Connect.getResultsToJSON(rs);
                petKeeper = gson.fromJson(json, PetKeeper.class);
            }
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return petKeeper;
    }

    public PetKeeper databaseToPetKeepers(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petkeepers WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = Connect.getResultsToJSON(rs);
            Gson gson = new Gson();
            PetKeeper user = gson.fromJson(json, PetKeeper.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }
    public ArrayList<PetKeeper> getAllPetKeepers() {
        ArrayList<PetKeeper> petKeepers = new ArrayList<>();
        try {
            Connection con = Connect.getConnection();
            Statement stmt = con.createStatement();
            String query = "SELECT * FROM petkeepers";
            ResultSet rs = stmt.executeQuery(query);

            Gson gson = new Gson();

            while (rs.next()) {
                String json = Connect.getResultsToJSON(rs);
                PetKeeper petKeeper = gson.fromJson(json, PetKeeper.class);
                petKeepers.add(petKeeper);
            }
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return petKeepers;
    }
    public ArrayList<PetKeeper> getAvailableKeepers(String type) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<PetKeeper> keepers = new ArrayList<PetKeeper>();
        ResultSet rs = null;
        try {
            //if(type=="catkeeper")
            if ("all".equals(type)) {
                rs = stmt.executeQuery("SELECT * FROM `petKeepers` WHERE  `petKeepers`.`keeper_id` not in (select keeper_id "
                        + "from `bookings` where `status`='requested' or  `status`='accepted')\n" + "");
            } else if ("catKeepers".equals(type)) {
                rs = stmt.executeQuery("SELECT * FROM `petKeepers` WHERE `petKeepers`.`catkeeper`='true' AND `petKeepers`.`keeper_id` not in (select keeper_id "
                        + "from `bookings` where `status`='requested' or  `status`='accepted')");
            } else if ("dogKeepers".equals(type)) {
                rs = stmt.executeQuery("SELECT * FROM `petKeepers` WHERE `petKeepers`.`dogkeeper`='true' AND `petKeepers`.`keeper_id` not in (select keeper_id "
                        + "from `bookings` where `status`='requested' or  `status`='accepted')");
            }

            while (rs.next()) {
                String json = Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                PetKeeper keeper = gson.fromJson(json, PetKeeper.class);
                keepers.add(keeper);
            }
            return keepers;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public ArrayList<PetKeeper> getKeepers(String type) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<PetKeeper> keepers = new ArrayList<PetKeeper>();
        ResultSet rs = null;
        try {
            if ("catkeeper".equals(type)) {
                rs = stmt.executeQuery("SELECT * FROM petkeepers WHERE catkeeper= '" + "true" + "'");
            } else if ("dogkeeper".equals(type)) {
                rs = stmt.executeQuery("SELECT * FROM petkeepers WHERE dogkeeper= '" + "true" + "'");
            }

            while (rs.next()) {
                String json = Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                PetKeeper keeper = gson.fromJson(json, PetKeeper.class);
                keepers.add(keeper);
            }
            return keepers;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public String databasePetKeeperToJSON(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petkeepers WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = Connect.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createPetKeepersTable() throws SQLException, ClassNotFoundException {

        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE petkeepers "
                + "(keeper_id INTEGER not NULL AUTO_INCREMENT, "
                + "    username VARCHAR(30) not null unique,"
                + "    email VARCHAR(50) not null unique,	"
                + "    password VARCHAR(32) not null,"
                + "    firstname VARCHAR(30) not null,"
                + "    lastname VARCHAR(30) not null,"
                + "    birthdate DATE not null,"
                + "    gender  VARCHAR (7) not null,"
                + "    country VARCHAR(30) not null,"
                + "    city VARCHAR(50) not null,"
                + "    address VARCHAR(50) not null,"
                + "    personalpage VARCHAR(200) not null,"
                + "    job VARCHAR(200) not null,"
                + "    telephone VARCHAR(14),"
                + "    lat DOUBLE,"
                + "    lon DOUBLE,"
                + "    property VARCHAR(10) not null,"
                + "    propertydescription VARCHAR(200),"
                + "    catkeeper VARCHAR(10) not null,"
                + "    dogkeeper VARCHAR(10) not null,"
                + "    catprice INTEGER,"
                + "    dogprice INTEGER,"
                + " PRIMARY KEY (keeper_id))";
        stmt.execute(query);
        stmt.close();
    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void addNewPetKeeper(PetKeeper user) throws ClassNotFoundException {
        try {
            Connection con = Connect.getConnection();
            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO petkeepers (username, email, password, firstname, lastname, birthdate, gender, country, city, address, personalpage, job, telephone, lat, lon, property, propertydescription, catkeeper, dogkeeper, catprice, dogprice) VALUES ("
                    + "'" + user.getUsername() + "',"
                    + "'" + user.getEmail() + "',"
                    + "'" + user.getPassword() + "',"
                    + "'" + user.getFirstname() + "',"
                    + "'" + user.getLastname() + "',"
                    + "'" + user.getBirthdate() + "',"
                    + "'" + user.getGender() + "',"
                    + "'" + user.getCountry() + "',"
                    + "'" + user.getCity() + "',"
                    + "'" + user.getAddress() + "',"
                    + "'" + user.getPersonalpage() + "',"
                    + "'" + user.getJob() + "',"
                    + "'" + user.getTelephone() + "',"
                    + 0.0 + ","
                    + 0.0 + ","
                    + "'" + user.getProperty() + "',"
                    + "'" + user.getPropertydescription() + "',"
                    + "'" + user.getCatkeeper() + "',"
                    + "'" + user.getDogkeeper() + "',"
                    + user.getCatprice() + ","
                    + user.getDogprice() + ")";

            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The pet owner was successfully added in the database.");
            stmt.close();
        } catch (SQLException ex) {
            Logger.getLogger(EditPetKeepersTable.class.getName()).log(Level.SEVERE, "SQL Exception: " + ex.getMessage(), ex);
        }
    }

}
