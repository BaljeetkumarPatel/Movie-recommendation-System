import logging
import os

from flask import Flask, jsonify
from flask_cors import CORS

from recommendation import RecommendationEngine
from routes.movie_routes import create_movie_routes


def create_app():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )

    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": os.getenv("FRONTEND_ORIGIN", "*")}})

    engine = RecommendationEngine()
    app.register_blueprint(create_movie_routes(engine))

    @app.get("/health")
    def health_check():
        return jsonify({"status": "ok"})

    @app.errorhandler(404)
    def not_found(error):
        return jsonify({"error": "Endpoint not found"}), 404

    @app.errorhandler(500)
    def server_error(error):
        app.logger.exception("Unhandled server error: %s", error)
        return jsonify({"error": "Internal server error"}), 500

    return app


app = create_app()


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)), debug=True)
