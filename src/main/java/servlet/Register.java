/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package servlet;

import DB_tables.EditPetKeepersTable;
import DB_tables.EditPetOwnersTable;
import java.io.BufferedReader;
import javax.servlet.*;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import com.google.gson.Gson;
import mainClasses.PetKeeper;

import mainClasses.PetOwner;

public class Register extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");

        PetOwner newPetOwner;
        PetKeeper newPetKeeper;

        StringBuilder sb = new StringBuilder();
        try ( BufferedReader reader = request.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        }

        String jsonString = sb.toString();

        Gson gson = new Gson();


        try ( PrintWriter out = response.getWriter()) {

            if (jsonString.contains("Owner")) {
                newPetOwner = gson.fromJson(jsonString, PetOwner.class);

                EditPetOwnersTable eut = new EditPetOwnersTable();

                try {
                    eut.addNewPetOwner(newPetOwner);

                    response.setStatus(200);
                    out.println("{ \"status\": \"success\", \"message\": \"Registration successful.\" }");

                } catch (ClassNotFoundException ex) {
                    ex.printStackTrace();
                    response.setStatus(500);
                    out.println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
                }

            } else if (jsonString.contains("Keeper")) {
                newPetKeeper = gson.fromJson(jsonString, PetKeeper.class);

                EditPetKeepersTable eut = new EditPetKeepersTable();

                try {
                    eut.addNewPetKeeper(newPetKeeper);

                    response.setStatus(200);
                    out.println("{ \"status\": \"success\", \"message\": \"Registration successful.\" }");

                } catch (ClassNotFoundException ex) {
                    ex.printStackTrace();
                    response.setStatus(500);
                    out.println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
                }
            }

        } catch (IOException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public String getServletInfo() {
        return "RegisterPetKeeper servlet";
    }
}
