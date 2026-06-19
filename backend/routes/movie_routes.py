from flask import Blueprint, current_app, jsonify, request

from recommendation import MovieNotFoundError


def create_movie_routes(engine):
    movie_routes = Blueprint("movie_routes", __name__)

    @movie_routes.get("/movies")
    def get_movies():
        return jsonify(engine.get_movie_titles())

    @movie_routes.post("/recommend")
    def recommend_movies():
        payload = request.get_json(silent=True) or {}
        movie_title = payload.get("movie", "")
        limit = payload.get("limit", 10)

        try:
            limit = max(1, min(int(limit), 20))
            recommendations = engine.recommend(movie_title, n=limit)
            return jsonify({"recommendations": recommendations})
        except MovieNotFoundError as error:
            return jsonify({"error": str(error)}), 404
        except (TypeError, ValueError):
            return jsonify({"error": "Invalid recommendation request"}), 400
        except Exception as error:
            current_app.logger.exception("Recommendation failed: %s", error)
            return jsonify({"error": "Unable to generate recommendations"}), 500

    @movie_routes.get("/trending")
    def get_trending():
        limit = request.args.get("limit", 8)
        try:
            limit = max(1, min(int(limit), 20))
        except ValueError:
            limit = 8
        return jsonify({"movies": engine.trending(limit=limit)})

    return movie_routes
