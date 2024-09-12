// package com.example.demo.dao;

// import java.util.List;

// import org.springframework.jdbc.core.JdbcTemplate;
// import org.springframework.jdbc.core.RowMapper;
// import org.springframework.stereotype.Repository;

// import com.example.demo.dto.Page;
// import com.example.demo.entity.Post;

// @Repository
// public class PostDao {
//     private final JdbcTemplate jdbcTemplate;

//     public PostDao(JdbcTemplate jdbcTemplate) {
//         this.jdbcTemplate = jdbcTemplate;
//     }

//     // 게시글 목록 가져오기
//     public List<Post> getPosts(Page page) {
//         int startIndex = page.getIndex() + 1; // ROW_NUMBER()는 1부터 시작
//         int endIndex = page.getIndex() + page.getRows();

//         String sql = "SELECT * FROM ( " +
//                      "  SELECT POST.*, " +
//                      "         ROW_NUMBER() OVER (ORDER BY ponum) AS RNUM " +
//                      "  FROM POST " +
//                      ") AS SUB " + // 서브 쿼리의 별칭 추가
//                      "WHERE RNUM BETWEEN ? AND ?";

//         return jdbcTemplate.query(sql, ps -> {
//             ps.setInt(1, startIndex);
//             ps.setInt(2, endIndex);
//         }, postRowMapper());
//     }

//     // 총 게시글 수 가져오기
//     public int getTotalPostsCount() {
//         String sql = "SELECT COUNT(*) FROM POST"; // 총 게시글 수를 가져오는 SQL 쿼리
//         Integer count = jdbcTemplate.queryForObject(sql, Integer.class); // 쿼리 결과를 Integer로 반환
//         return count != null ? count : 0; // count가 null인 경우 0 반환
//     }

//     private RowMapper<Post> postRowMapper() {
//         return (rs, rowNum) -> {
//             Post post = new Post();
//             post.setPonum(rs.getInt("ponum")); // 게시글 번호
//             post.setId(rs.getString("id")); // 작성자 ID
//             post.setPotitle(rs.getString("potitle")); // 제목
//             post.setPocontents(rs.getString("pocontents")); // 내용
//             post.setPowarning(rs.getInt("powarning")); // 경고 여부
//             post.setViewCnt(rs.getInt("viewCnt")); // 조회수
//             post.setReplyCnt(rs.getInt("replyCnt")); // 댓글 수
//             post.setPodate(rs.getTimestamp("podate")); // 작성일 (Timestamp로 변환)
//             post.setPofile(rs.getString("pofile")); // 파일
//             return post;
//         };
//     }
// }