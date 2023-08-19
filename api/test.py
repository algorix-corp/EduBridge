from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)
admin_token = ""
building_token = ""
academy_token = ""


def test_root():
    response = client.get("/")
    assert response.status_code == 200


def test_login():
    response = client.post("/login", json={"email": "ryankwon@algorix.io", "password": "1234"})
    global admin_token
    admin_token = response.json()["Bearer"]
    assert response.status_code == 200


def test_auth():
    response = client.post("/auth", headers={"Authorization": f"Bearer {admin_token}"})
    assert response.status_code == 200


# def test_building_register():
#     response = client.post("/user", json={
#         "name": "Demo Building Manager",
#         "email": "demo_bdm@algorix.io",
#         "password": "1234",
#         "phone": "821012345678",
#         "role": "building",
#     })
#     assert response.status_code == 200


def test_building_login():
    response = client.post("/login", json={"email": "demo_bdm@algorix.io", "password": "1234"})
    global building_token
    building_token = response.json()["Bearer"]
    assert response.status_code == 200


def test_building_auth():
    response = client.post("/auth", headers={"Authorization": f"Bearer {building_token}"})
    assert response.status_code == 200


def test_academy_register():
    response = client.post("/user", json={
        "name": "Demo Academy Manager",
        "email": "demo_acd@algorix.io",
        "password": "1234",
        "phone": "821012345678",
        "role": "building",
    })
    assert response.status_code == 200


def test_academy_login():
    response = client.post("/login", json={"email": "demo_acd@algorix.io", "password": "1234"})
    global academy_token
    academy_token = response.json()["Bearer"]
    assert response.status_code == 200


def test_academy_auth():
