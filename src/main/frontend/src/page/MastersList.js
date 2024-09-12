import React, { useState, useEffect } from "react";
import axios from "axios";

function MastersList() {
  const [masters, setMasters] = useState([]);
  const [newMaster, setNewMaster] = useState({ mid: "", mpwd: "" });
  const [editingMaster, setEditingMaster] = useState(null);
  const [searchParams, setSearchParams] = useState({ mid: "", mpwd: "", keyword: "", type: "" });
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetchMasters();
  }, []);

  const fetchMasters = async (params = {}) => {
    try {
      const response = await axios.get("http://localhost:8080/api/masters", { params });
      setMasters(response.data);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching masters:", error);
    }
  };

  const handleInputChange = (e) => {
    setNewMaster({ ...newMaster, [e.target.name]: e.target.value });
  };

  const handleSearchInputChange = (e) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingMaster) {
      await axios.put(
        `http://localhost:8080/api/masters/${editingMaster.mid}`,
        newMaster
      );
    } else {
      await axios.post("http://localhost:8080/api/masters", newMaster);
    }
    fetchMasters();
    setNewMaster({ mid: "", mpwd: "" });
    setEditingMaster(null);
  };

  const handleEdit = (master) => {
    setNewMaster({ mid: master.mid, mpwd: master.mpwd });
    setEditingMaster(master);
  };

  const handleDelete = async (mid) => {
    await axios.delete(`http://localhost:8080/api/masters/${mid}`);
    fetchMasters();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:8080/api/masters/search", { params: searchParams });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching masters:", error);
    }
  };

  return (
    <div className="App">
      <h1>Master 관리</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="mid"
          placeholder="관리자 아이디"
          value={newMaster.mid}
          onChange={handleInputChange}
          disabled={editingMaster !== null}
        />
        <input
          type="password"
          name="mpwd"
          placeholder="패스워드"
          value={newMaster.mpwd}
          onChange={handleInputChange}
        />
        <button type="submit">
          {editingMaster ? "수정하기" : "추가하기"}
        </button>
      </form>

      <h2>Master 목록</h2>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          name="mid"
          placeholder="아이디로 검색"
          value={searchParams.mid}
          onChange={handleSearchInputChange}
        />
        <input
          type="text"
          name="mpwd"
          placeholder="패스워드로 검색"
          value={searchParams.mpwd}
          onChange={handleSearchInputChange}
        />
        <input
          type="text"
          name="keyword"
          placeholder="키워드로 검색"
          value={searchParams.keyword}
          onChange={handleSearchInputChange}
        />
        <select
          name="type"
          value={searchParams.type}
          onChange={handleSearchInputChange}
        >
          <option value="">검색 유형 선택</option>
          <option value="mid">ID로 검색</option>
          <option value="mpwd">Password로 검색</option>
          <option value="or">ID 또는 Password로 검색</option>
          <option value="and">ID 및 Password로 검색</option>
        </select>
        <button type="submit">검색</button>
      </form>

      <ul>
        {searchResults.map((master) => (
          <li key={master.mid}>
            {master.mid} - {master.mpwd}{" "}
            <button onClick={() => handleEdit(master)}>수정</button>
            <button onClick={() => handleDelete(master.mid)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MastersList;