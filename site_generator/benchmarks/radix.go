package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"os"
	"regexp"
	"sort"
	//"strconv"
	"strings"
	"time"
)

type Site struct {
	Title      string   `json:"title"`
	Body       string   `json:"body"`
	Links      []int    `json:"links"`
	ParentSite string   `json:"parent_site"`
	SiteURL    string   `json:"site_url"`
	LinkURL    []string `json:"link_urls"`
	Slug       string   `json:"slug"`
}

type leafNode struct {
	val string
}

type edge struct {
	label byte
	node  *node
}

type node struct {
	leaf   *leafNode
	prefix string
	edges  edges
}

func (n *node) isLeaf() bool {
	return n.leaf != nil
}

func (n *node) addEdge(e edge) {
	n.edges = append(n.edges, e)
	n.edges.Sort()
}

func (n *node) updateEdge(label byte, node *node) {
	num := len(n.edges)
	idx := sort.Search(num, func(i int) bool {
		return n.edges[i].label >= label
	})
	if idx < num && n.edges[idx].label == label {
		n.edges[idx].node = node
		return
	}
	panic("replacing missing edge")
}

func (n *node) getEdge(label byte) *node {
	num := len(n.edges)
	idx := sort.Search(num, func(i int) bool {
		return n.edges[i].label >= label
	})
	if idx < num && n.edges[idx].label == label {
		return n.edges[idx].node
	}
	return nil
}

type edges []edge

func (e edges) Len() int {
	return len(e)
}

func (e edges) Less(i, j int) bool {
	return e[i].label < e[j].label
}

func (e edges) Sort() {
	sort.Sort(e)
}

func (e edges) Swap(i, j int) {
	e[i], e[j] = e[j], e[i]
}

type Tree struct {
	root *node
	size int
}

func (t *Tree) Len() int {
	return t.size
}

func longestPrefix(k1, k2 string) int {
	max := len(k1)
	if l := len(k2); l < max {
		max = l
	}
	var i int
	for i = 0; i < max; i++ {
		if k1[i] != k2[i] {
			break
		}
	}
	return i
}

func (t *Tree) Insert(val string) (interface{}, bool) {
	var parent *node
	n := t.root
	search := val
	for {
		if len(search) == 0 {
			if n.isLeaf() {
				old := n.leaf.val
				n.leaf.val = val
				return old, true
			}

			n.leaf = &leafNode{
				val: val,
			}
			t.size++
			return nil, false
		}

		parent = n
		n = n.getEdge(search[0])

		if n == nil {
			e := edge{
				label: search[0],
				node: &node{
					leaf: &leafNode{
						val: val,
					},
					prefix: search,
				},
			}
			parent.addEdge(e)
			t.size++
			return nil, false
		}

		commonPrefix := longestPrefix(search, n.prefix)
		if commonPrefix == len(n.prefix) {
			search = search[commonPrefix:]
			continue
		}

		t.size++
		child := &node{
			prefix: search[:commonPrefix],
		}
		parent.updateEdge(search[0], child)

		child.addEdge(edge{
			label: n.prefix[commonPrefix],
			node:  n,
		})
		n.prefix = n.prefix[commonPrefix:]

		leaf := &leafNode{
			val: val,
		}

		search = search[commonPrefix:]
		if len(search) == 0 {
			child.leaf = leaf
			return nil, false
		}

		child.addEdge(edge{
			label: search[0],
			node: &node{
				leaf:   leaf,
				prefix: search,
			},
		})
		return nil, false
	}
}

func (t *Tree) Find(s string) (interface{}, bool) {
	n := t.root
	search := s
	for {
		if len(search) == 0 {
			if n.isLeaf() {
				return n.leaf.val, true
			}
			break
		}
		n = n.getEdge(search[0])
		if n == nil {
			break
		}
		if strings.HasPrefix(search, n.prefix) {
			search = search[len(n.prefix):]
		} else {
			break
		}
	}
	return nil, false
}

func initRadix() *Tree {
	return &Tree{root: &node{}}
}

func main() {
	jsonFile, err := os.Open("../site_data.json")
	if err != nil {
		fmt.Println(err)
	}

	defer jsonFile.Close()
	byteValue, _ := ioutil.ReadAll(jsonFile)
	var sites []Site
	json.Unmarshal(byteValue, &sites)

	radixTree := initRadix()
	var sum time.Duration

	for i := 0; i < len(sites); i++ {
		sentence := strings.Split(sites[i].Body, " ")
		for j := 0; j < len(sentence); j++ {
			sentence[j] = strings.ToLower(sentence[j])
			matched, _ := regexp.MatchString(`^[a-z]*$`, sentence[j])
			// fmt.Println(matched, sentence[j])
			t1 := time.Now()
			if matched {
				radixTree.Insert(sentence[j])
			}
			t2 := time.Now()
			elapsed := t2.Sub(t1)
			sum += elapsed
		}
	}

	//t1 := time.Now()
/*
	no_of_words, err := strconv.Atoi(os.Args[1])
	k := 0
	fl := 0
	for i := 0; i < len(sites); i++ {
		sentence := strings.Split(sites[i].Body, " ")
		for j := 0; j < len(sentence); j++ {
			sentence[j] = strings.ToLower(sentence[j])
			matched, _ := regexp.MatchString(`^[a-z]*$`, sentence[j])
			if matched {
				radixTree.Find(sentence[j])
				k++
				if k >= no_of_words {
					fl = 1
					break
				}
			}
		}
		if fl == 1 {
			break
		}
	}
*/
	//t2 := time.Now()
	//elapsed := t2.Sub(t1)
	fmt.Println(sum)
}
