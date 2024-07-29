package servlet;

import DB_tables.EditPetKeepersTable;
import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

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
}