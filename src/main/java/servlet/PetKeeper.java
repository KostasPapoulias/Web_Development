package servlet;

import DB_tables.EditPetKeepersTable;
import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;

public class PetKeeper extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        if (username != null && !username.isEmpty()) {
            EditPetKeepersTable editPetKeepersTable = new EditPetKeepersTable();
            mainClasses.PetKeeper petKeeper = editPetKeepersTable.getPetKeeperByUsername(username);

            if (petKeeper != null) {
                Gson gson = new Gson();
                String json = gson.toJson(petKeeper);

                response.setContentType("application/json");
                response.setCharacterEncoding("UTF-8");
                PrintWriter out = response.getWriter();
                out.print(json);
                out.flush();
            } else {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "PetKeeper not found");
            }
        } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing or empty username parameter");
        }
    }
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder buffer = new StringBuilder();
        BufferedReader reader = request.getReader();
        String line;
        while ((line = reader.readLine()) != null) {
            buffer.append(line);
        }
        String data = buffer.toString();

        Gson gson = new Gson();
        mainClasses.PetKeeper updatePetKeeper = gson.fromJson(data, mainClasses.PetKeeper.class);

        EditPetKeepersTable eut = new EditPetKeepersTable();

        try {
            eut.updatePetKeeperData(
                    updatePetKeeper.getUsername(),
                    updatePetKeeper.getPassword(),
                    updatePetKeeper.getFirstname(),
                    updatePetKeeper.getLastname(),
                    updatePetKeeper.getTelephone(),
                    updatePetKeeper.getCity(),
                    updatePetKeeper.getAddress(),
                    updatePetKeeper.getProperty(),
                    updatePetKeeper.getPropertydescription(),
                    updatePetKeeper.getCatkeeper(),
                    updatePetKeeper.getDogkeeper(),
                    String.valueOf(updatePetKeeper.getCatprice()),
                    String.valueOf(updatePetKeeper.getDogprice())
            );
            response.setStatus(200);
            response.getWriter().println("{ \"status\": \"success\", \"message\": \"Update successful.\" }");
        } catch (SQLException | ClassNotFoundException ex) {
            ex.printStackTrace();
            System.out.println(ex.getMessage());
            response.setStatus(500);
            response.getWriter().println("{ \"status\": \"error\", \"message\": \"Internal Server Error.\" }");
        }
    }
}