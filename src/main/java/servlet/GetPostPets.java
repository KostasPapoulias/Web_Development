package servlet;

import DB_tables.EditPetsTable;
import com.google.gson.Gson;
import mainClasses.Pet;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;

public class GetPostPets extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

        EditPetsTable editPetsTable = new EditPetsTable();
        try {
            editPetsTable.createPetsTable();
        } catch (ClassNotFoundException | SQLException e) {
            e.printStackTrace();
        }

        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();

        Gson gson = new Gson();
        Pet newPet = gson.fromJson(data, Pet.class);



        try ( PrintWriter out = response.getWriter()) {
            //newPet = gson.fromJson(jsonString, Pet.class);

            EditPetsTable eut = new EditPetsTable();

            try {
                eut.createNewPet(newPet);

                response.setStatus(200);
                out.println("{ \"status\": \"success\", \"message\": \"Registration successful.\" }");

            } catch (ClassNotFoundException ex) {
                ex.printStackTrace();
                response.setStatus(500);
                out.println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String ownerId = request.getParameter("owner_id");
        EditPetsTable editPetsTable = new EditPetsTable();
        ArrayList<Pet> pets;
        try {
            pets = editPetsTable.getPetsByOwnerId(ownerId);
        } catch (SQLException | ClassNotFoundException e) {
            e.printStackTrace();
            response.setStatus(500);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
            return;
        }

        Gson gson = new Gson();
        String petsJson = gson.toJson(pets);

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(petsJson);
    }

    @Override
    public String getServletInfo() {
        return "NewPet servlet";
    }
}