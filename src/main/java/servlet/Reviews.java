package servlet;

import DB_tables.EditReviewsTable;
import mainClasses.Review;
import com.google.gson.Gson;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.ArrayList;

public class Reviews extends HttpServlet {

    private EditReviewsTable editReviewsTable = new EditReviewsTable();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String keeperId = request.getParameter("keeper_id");
        response.setContentType("application/json");
        PrintWriter out = response.getWriter();
        try {
            ArrayList<Review> reviews = editReviewsTable.databaseTokeeperReviews(keeperId);
            Gson gson = new Gson();
            String json = gson.toJson(reviews);
            out.print(json);
            out.flush();
        } catch (SQLException | ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\":\"" + e.getMessage() + "\"}");
            out.flush();
        }
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder sb = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            sb.append(line);
        }
        String json = sb.toString();
        Gson gson = new Gson();
        Review review = gson.fromJson(json, Review.class);
        try {
            editReviewsTable.createNewReview(review);
            response.setStatus(HttpServletResponse.SC_CREATED);
        } catch (ClassNotFoundException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().print("{\"error\":\"" + e.getMessage() + "\"}");
        }
    }
}