/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package DB_tables;

import DB_Connection.Connect;
import com.google.gson.Gson;
import mainClasses.PetOwner;

import java.sql.*;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Mike
 */
public class EditPetOwnersTable {

    public void addPetOwnerFromJSON(String json) throws ClassNotFoundException {
        PetOwner user = jsonToPetOwner(json);
        addNewPetOwner(user);
    }
    public void updatePetOwnerInfo(String username, String password, String firstname, String lastname, String telephone) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        String updateQuery = "UPDATE petowners SET ";

        if (password != null && !password.isEmpty()) {
            updateQuery += "password='" + password + "',";
        }
        if (firstname != null && !firstname.isEmpty()) {
            updateQuery += "firstname='" + firstname + "',";
        }
        if (lastname != null && !lastname.isEmpty()) {
            updateQuery += "lastname='" + lastname + "',";
        }
        if (telephone != null && !telephone.isEmpty()) {
            updateQuery += "telephone='" + telephone + "',";
        }

        if (updateQuery.endsWith(",")) {
            updateQuery = updateQuery.substring(0, updateQuery.length() - 1);
        }

        updateQuery += " WHERE username = '" + username + "'";
        System.out.println("UPDATE QUERY: " + updateQuery);

        try {
            stmt.executeUpdate(updateQuery);
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
    }


    public PetOwner jsonToPetOwner(String json) {
        Gson gson = new Gson();

        PetOwner user = gson.fromJson(json, PetOwner.class);
        return user;
    }

    public String petOwnerToJSON(PetOwner user) {
        Gson gson = new Gson();

        String json = gson.toJson(user, PetOwner.class);
        return json;
    }

    public void updatePetOwner(String username, String personalpage) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();
        String update = "UPDATE petowners SET personalpage='" + personalpage + "' WHERE username = '" + username + "'";
        stmt.executeUpdate(update);
    }

    public PetOwner databaseToPetOwners(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petowners WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = Connect.getResultsToJSON(rs);
            Gson gson = new Gson();
            PetOwner user = gson.fromJson(json, PetOwner.class);
            return user;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public int getOwnerIdByUsername(String username) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        PreparedStatement pstmt = null;
        ResultSet rs = null;

        try {
            String query = "SELECT owner_id FROM petowners WHERE username = ?";
            pstmt = con.prepareStatement(query);
            pstmt.setString(1, username);
            rs = pstmt.executeQuery();

            if (rs.next()) {
                return rs.getInt("owner_id");
            } else {
                throw new IllegalArgumentException("No user found with the provided username");
            }
        } finally {
            if (rs != null) {
                rs.close();
            }
            if (pstmt != null) {
                pstmt.close();
            }
            if (con != null) {
                con.close();
            }
        }
    }

    public String databasePetOwnerToJSON(String username, String password) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        ResultSet rs;
        try {
            rs = stmt.executeQuery("SELECT * FROM petowners WHERE username = '" + username + "' AND password='" + password + "'");
            rs.next();
            String json = Connect.getResultsToJSON(rs);
            return json;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

    public void createPetOwnersTable() throws SQLException, ClassNotFoundException {

        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();

        String query = "CREATE TABLE petowners "
                + "(owner_id INTEGER not NULL AUTO_INCREMENT, "
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
                + " PRIMARY KEY (owner_id))";
        stmt.execute(query);
        stmt.close();
    }

    /**
     * Establish a database connection and add in the database.
     *
     * @throws ClassNotFoundException
     */
    public void addNewPetOwner(PetOwner user) throws ClassNotFoundException {
        try {
            Connection con = Connect.getConnection();

            Statement stmt = con.createStatement();

            String insertQuery = "INSERT INTO "
                    + " petowners (username,email,password,firstname,lastname,birthdate,gender,country,city,address,personalpage,"
                    + "job,telephone,lat,lon)"
                    + " VALUES ("
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
                    + "'" + 0.0 + "',"
                    + "'" + 0.0 + "'"
                    + ")";
            //stmt.execute(table);
            System.out.println(insertQuery);
            stmt.executeUpdate(insertQuery);
            System.out.println("# The pet owner was successfully added in the database.");

            /* Get the member id from the database and set it to the member */
            stmt.close();

        } catch (SQLException ex) {
            Logger.getLogger(EditPetOwnersTable.class.getName()).log(Level.SEVERE, null, ex);
        }
    }

    public void deletePetOwnerByUsername(String username) throws ClassNotFoundException {
        Connection con = null;
        Statement stmt = null;
        try {
            con = Connect.getConnection();
            stmt = con.createStatement();
            String deleteQuery = "DELETE FROM petowners WHERE username = '" + username + "'";
            stmt.executeUpdate(deleteQuery);
            System.out.println("PetOwner with username " + username + " was successfully deleted.");
        } catch (SQLException ex) {
            Logger.getLogger(EditPetOwnersTable.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            if (stmt != null) {
                try {
                    stmt.close();
                } catch (SQLException ex) {
                    Logger.getLogger(EditPetOwnersTable.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
            if (con != null) {
                try {
                    con.close();
                } catch (SQLException ex) {
                    Logger.getLogger(EditPetOwnersTable.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        }
    }

    public ArrayList<PetOwner> getAvailableOwners(String type) throws SQLException, ClassNotFoundException {
        Connection con = Connect.getConnection();
        Statement stmt = con.createStatement();
        ArrayList<PetOwner> owners = new ArrayList<PetOwner>();
        ResultSet rs = null;
        try {
            //if(type=="catkeeper")
//            if ("all".equals(type)) {
//                rs = stmt.executeQuery("SELECT * FROM `petOwners` WHERE  `petOwners`.`owner_id` not in (select owner_id "
//                        + "from `bookings` where `status`='requested' or  `status`='accepted')\n" + "");
//            }
            if ("all".equals(type)) {
                rs = stmt.executeQuery("SELECT * FROM `petOwners`");
            }

            while (rs.next()) {
                String json = Connect.getResultsToJSON(rs);
                Gson gson = new Gson();
                PetOwner owner = gson.fromJson(json, PetOwner.class);
                owners.add(owner);
            }
            return owners;
        } catch (Exception e) {
            System.err.println("Got an exception! ");
            System.err.println(e.getMessage());
        }
        return null;
    }

}
